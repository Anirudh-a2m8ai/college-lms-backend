import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ClassRoom } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassRoomDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ClassRoomFindUniqueArgs): Promise<ClassRoom | null> {
    return await this.prisma.classRoom.findUnique(query);
  }

  async findFirst(query: Prisma.ClassRoomFindFirstArgs): Promise<ClassRoom | null> {
    return await this.prisma.classRoom.findFirst(query);
  }

  async findMany(query: Prisma.ClassRoomFindManyArgs): Promise<ClassRoom[]> {
    return await this.prisma.classRoom.findMany(query);
  }

  async create(payload: Prisma.ClassRoomCreateArgs): Promise<ClassRoom> {
    return await this.prisma.classRoom.create(payload);
  }

  async createMany(payload: Prisma.ClassRoomCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.classRoom.createMany(payload);
  }

  async update(payload: Prisma.ClassRoomUpdateArgs): Promise<ClassRoom> {
    return await this.prisma.classRoom.update(payload);
  }

  async delete(payload: Prisma.ClassRoomDeleteArgs): Promise<ClassRoom> {
    return await this.prisma.classRoom.delete(payload);
  }

  async count(query: Prisma.ClassRoomCountArgs): Promise<number> {
    return await this.prisma.classRoom.count(query);
  }

  async createClassRoomMap(classRoomId: string, courseVersionId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const [moduleMaps, chapterMaps, lessonMaps, topicMaps, subTopicMaps] = await Promise.all([
          tx.moduleMap.findMany({
            where: { courseVersionId: courseVersionId },
          }),
          tx.chapterMap.findMany({
            where: { courseVersionId: courseVersionId },
          }),
          tx.lessonMap.findMany({
            where: { courseVersionId: courseVersionId },
          }),
          tx.topicMap.findMany({
            where: { courseVersionId: courseVersionId },
          }),
          tx.subTopicMap.findMany({
            where: { courseVersionId: courseVersionId },
          }),
        ]);

        if (moduleMaps.length) {
          await tx.classModuleMap.createMany({
            data: moduleMaps.map((moduleMap) => ({
              moduleId: moduleMap.moduleId,
              classRoomId: classRoomId,
              orderIndex: moduleMap.orderIndex,
            })),
          });
        }

        if (chapterMaps.length) {
          await tx.classChapterMap.createMany({
            data: chapterMaps.map((chapterMap) => ({
              chapterId: chapterMap.chapterId,
              classRoomId: classRoomId,
              moduleId: chapterMap.moduleId,
              orderIndex: chapterMap.orderIndex,
            })),
          });
        }

        if (lessonMaps.length) {
          await tx.classLessonMap.createMany({
            data: lessonMaps.map((lessonMap) => ({
              lessonId: lessonMap.lessonId,
              classRoomId: classRoomId,
              chapterId: lessonMap.chapterId,
              orderIndex: lessonMap.orderIndex,
            })),
          });
        }

        if (topicMaps.length) {
          await tx.classTopicMap.createMany({
            data: topicMaps.map((topicMap) => ({
              topicId: topicMap.topicId,
              classRoomId: classRoomId,
              lessonId: topicMap.lessonId,
              orderIndex: topicMap.orderIndex,
            })),
          });
        }

        if (subTopicMaps.length) {
          await tx.classSubTopicMap.createMany({
            data: subTopicMaps.map((subTopicMap) => ({
              subTopicId: subTopicMap.subTopicId,
              classRoomId: classRoomId,
              topicId: subTopicMap.topicId,
              orderIndex: subTopicMap.orderIndex,
            })),
          });
        }
        return { classRoomId };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 60_000,
      },
    );
  }

  async getClassRoom(classRoomId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const [modules, chapters, lessons, topics, subTopics] = await Promise.all([
          tx.classModuleMap.findMany({
            where: { classRoomId: classRoomId },
            orderBy: { orderIndex: 'asc' },
            include: { module: true },
          }),
          tx.classChapterMap.findMany({
            where: { classRoomId: classRoomId },
            orderBy: { orderIndex: 'asc' },
            include: { chapter: true },
          }),
          tx.classLessonMap.findMany({
            where: { classRoomId: classRoomId },
            orderBy: { orderIndex: 'asc' },
            include: { lesson: true },
          }),
          tx.classTopicMap.findMany({
            where: { classRoomId: classRoomId },
            orderBy: { orderIndex: 'asc' },
            include: { topic: true },
          }),
          tx.classSubTopicMap.findMany({
            where: { classRoomId: classRoomId },
            orderBy: { orderIndex: 'asc' },
            include: { subTopic: true },
          }),
        ]);

        const chapterByModule = new Map();
        const lessonByChapter = new Map();
        const topicByLesson = new Map();
        const subTopicByTopic = new Map();

        for (const s of subTopics) {
          if (!subTopicByTopic.has(s.topicId)) {
            subTopicByTopic.set(s.topicId, []);
          }
          subTopicByTopic.get(s.topicId).push({
            ...s.subTopic,
            orderIndex: s.orderIndex,
          });
        }

        for (const t of topics) {
          if (!topicByLesson.has(t.lessonId)) {
            topicByLesson.set(t.lessonId, []);
          }
          topicByLesson.get(t.lessonId).push({
            ...t.topic,
            orderIndex: t.orderIndex,
            subTopic: subTopicByTopic.get(t.topicId) || [],
          });
        }

        for (const l of lessons) {
          if (!lessonByChapter.has(l.chapterId)) {
            lessonByChapter.set(l.chapterId, []);
          }
          lessonByChapter.get(l.chapterId).push({
            ...l.lesson,
            orderIndex: l.orderIndex,
            topic: topicByLesson.get(l.lessonId) || [],
          });
        }

        for (const c of chapters) {
          if (!chapterByModule.has(c.moduleId)) {
            chapterByModule.set(c.moduleId, []);
          }
          chapterByModule.get(c.moduleId).push({
            ...c.chapter,
            orderIndex: c.orderIndex,
            lesson: lessonByChapter.get(c.chapterId) || [],
          });
        }

        const moduleData = modules.map((m) => ({
          ...m.module,
          orderIndex: m.orderIndex,
          chapter: chapterByModule.get(m.module.id) || [],
        }));

        return moduleData;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 60_000,
      },
    );
  }
}
