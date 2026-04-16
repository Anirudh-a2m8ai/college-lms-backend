import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import * as fsSync from 'fs';
import { promises as fs } from 'fs';
import * as bcrypt from 'bcrypt';
import * as XLSX from 'xlsx';
import { UserService } from 'src/api/user/user.service';
import csv from 'csv-parser';
import { generateRandomPassword } from 'src/utils/generate-password.util';
import { AccountStatus, RoleType } from 'src/generated/prisma/enums';

@Injectable()
@Processor('userQueue')
export class UserProcessor extends WorkerHost {
  constructor(private readonly userService: UserService) {
    super();
  }
  async process(job: Job<{ filePath: string }>) {
    console.log('🔥 Worker picked job:', job.name);
    if (job.name !== 'bulkUpload') return;

    const { filePath } = job.data;

    const BATCH_SIZE = 500;
    const batch: any[] = [];

    let processed = 0;
    let success = 0;
    let failed = 0;

    try {
      const isCSV = filePath.endsWith('.csv');

      if (isCSV) {
        await new Promise((resolve, reject) => {
          const stream = fsSync.createReadStream(filePath).pipe(csv());

          let pending = 0;
          let ended = false;

          const maybeFinish = async () => {
            if (ended && pending === 0) {
              if (batch.length > 0) {
                const result = await this.userService.createUsersBulk(batch);
                success += result.success;
                batch.length = 0;
              }

              resolve(null);
            }
          };

          stream.on('data', (row) => {
            stream.pause();
            pending++;

            (async () => {
              processed++;

              try {
                if (!row.email) throw new Error();

                const { hashedPassword } = await generateRandomPassword();

                const user = {
                  firstName: row.firstName?.trim(),
                  lastName: row.lastName?.trim(),
                  email: row.email.toLowerCase().trim(),
                  passwordHash: hashedPassword,
                  phone: row.phone,
                  bio: row.bio,
                  roleId: row.roleId,
                  status: AccountStatus.INACTIVE,
                };

                batch.push(user);

                if (batch.length === BATCH_SIZE) {
                  const result = await this.userService.createUsersBulk(batch);
                  success += result.success;
                  batch.length = 0;
                }
              } catch {
                failed++;
              }

              if (processed % 100 === 0) {
                await job.updateProgress({ processed, success, failed });
              }

              pending--;
              stream.resume();

              await maybeFinish();
            })().catch(reject);
          });

          stream.on('end', () => {
            ended = true;
            maybeFinish();
          });

          stream.on('error', reject);
        });
      } else {
        // Excel logic unchanged
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(sheet);

        for (const row of rows) {
          processed++;

          try {
            if (!row.email) throw new Error();

            const { hashedPassword } = await generateRandomPassword();

            const user = {
              firstName: row.firstName?.trim(),
              lastName: row.lastName?.trim(),
              email: row.email.toLowerCase().trim(),
              passwordHash: hashedPassword,
              phone: row.phone,
              bio: row.bio,
              role: row.roleId,
              status: AccountStatus.INACTIVE,
            };

            batch.push(user);

            if (batch.length === BATCH_SIZE) {
              const result = await this.userService.createUsersBulk(batch);
              success += result.success;
              batch.length = 0;
            }
          } catch {
            failed++;
          }

          if (processed % 100 === 0) {
            await job.updateProgress({ processed, success, failed });
          }
        }
      }

      // final flush
      if (batch.length > 0) {
        const result = await this.userService.createUsersBulk(batch);
        success += result.success;
      }

      await job.updateProgress({ processed, success, failed });

      return { processed, success, failed };
    } finally {
      // 🔥 ALWAYS DELETE FILE
      try {
        await fs.unlink(filePath);
        console.log('🗑️ File deleted:', filePath);
      } catch (err) {
        console.error('❌ File delete failed:', err.message);
      }
    }
  }
}
