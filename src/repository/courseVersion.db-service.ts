import { Injectable } from '@nestjs/common';
import { Prisma, CourseVersion, CourseStatus } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseVersionDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.CourseVersionFindUniqueArgs): Promise<CourseVersion | null> {
    return await this.prisma.courseVersion.findUnique(query);
  }

  async findFirst(query: Prisma.CourseVersionFindFirstArgs): Promise<CourseVersion | null> {
    return await this.prisma.courseVersion.findFirst(query);
  }

  async findMany(query: Prisma.CourseVersionFindManyArgs): Promise<CourseVersion[]> {
    return await this.prisma.courseVersion.findMany(query);
  }

  async create(payload: Prisma.CourseVersionCreateArgs): Promise<CourseVersion> {
    return await this.prisma.courseVersion.create(payload);
  }

  async createMany(payload: Prisma.CourseVersionCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.courseVersion.createMany(payload);
  }

  async update(payload: Prisma.CourseVersionUpdateArgs): Promise<CourseVersion> {
    return await this.prisma.courseVersion.update(payload);
  }

  async delete(payload: Prisma.CourseVersionDeleteArgs): Promise<CourseVersion> {
    return await this.prisma.courseVersion.delete(payload);
  }

  async count(query: Prisma.CourseVersionCountArgs): Promise<number> {
    return await this.prisma.courseVersion.count(query);
  }

  async createCourseVersion(data: any, courseVersionId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        for (const [mIndex, module] of data.module.entries()) {
          const moduleEntity = await tx.module.create({
            data: {
              title: module.title,
              description: module.description,
              overview: module.overview,
            },
          });

          await tx.moduleMap.create({
            data: {
              moduleId: moduleEntity.id,
              courseVersionId,
              orderIndex: mIndex,
            },
          });

          for (const [cIndex, chapter] of module.chapter.entries()) {
            const chapterEntity = await tx.chapter.create({
              data: {
                title: chapter.title,
                description: chapter.description,
                overview: chapter.overview,
              },
            });

            await tx.chapterMap.create({
              data: {
                chapterId: chapterEntity.id,
                moduleId: moduleEntity.id,
                courseVersionId,
                orderIndex: cIndex,
              },
            });

            // -------- LESSON --------
            for (const [lIndex, lesson] of chapter.lesson.entries()) {
              const lessonEntity = await tx.lesson.create({
                data: {
                  title: lesson.title,
                  description: lesson.description,
                  overview: lesson.overview,
                },
              });

              await tx.lessonMap.create({
                data: {
                  lessonId: lessonEntity.id,
                  chapterId: chapterEntity.id,
                  courseVersionId,
                  orderIndex: lIndex,
                },
              });

              // -------- TOPIC --------
              for (const [tIndex, topic] of lesson.topic.entries()) {
                const topicEntity = await tx.topics.create({
                  data: {
                    title: topic.title,
                    overview: topic.overview,
                    description: topic.description,
                  },
                });

                await tx.topicMap.create({
                  data: {
                    topicId: topicEntity.id,
                    lessonId: lessonEntity.id,
                    courseVersionId,
                    orderIndex: tIndex,
                  },
                });

                // -------- SUBTOPIC --------
                for (const [sIndex, subTopic] of topic.subTopic.entries()) {
                  const subTopicEntity = await tx.subTopics.create({
                    data: {
                      title: subTopic.title,
                      content: subTopic.content,
                    },
                  });

                  await tx.subTopicMap.create({
                    data: {
                      subTopicId: subTopicEntity.id,
                      topicId: topicEntity.id,
                      courseVersionId,
                      orderIndex: sIndex,
                    },
                  });
                }
              }
            }
          }
        }

        return { message: 'Course version created successfully' };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 60_000,
      },
    );
  }

  async getCourseVersion(courseVersionId: string) {
    const [modules, chapters, lessons, topics, subTopics] = await this.prisma.$transaction([
      this.prisma.moduleMap.findMany({
        where: { courseVersionId },
        orderBy: { orderIndex: 'asc' },
        include: { module: true },
      }),
      this.prisma.chapterMap.findMany({
        where: { courseVersionId },
        orderBy: { orderIndex: 'asc' },
        include: { chapter: true },
      }),
      this.prisma.lessonMap.findMany({
        where: { courseVersionId },
        orderBy: { orderIndex: 'asc' },
        include: { lesson: true },
      }),
      this.prisma.topicMap.findMany({
        where: { courseVersionId },
        orderBy: { orderIndex: 'asc' },
        include: { topic: true },
      }),
      this.prisma.subTopicMap.findMany({
        where: { courseVersionId },
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
      subTopicByTopic.get(s.topicId).push(s.subTopic);
    }

    for (const t of topics) {
      if (!topicByLesson.has(t.lessonId)) {
        topicByLesson.set(t.lessonId, []);
      }
      topicByLesson.get(t.lessonId).push({
        ...t.topic,
        subTopic: subTopicByTopic.get(t.topicId) || [],
      });
    }

    for (const l of lessons) {
      if (!lessonByChapter.has(l.chapterId)) {
        lessonByChapter.set(l.chapterId, []);
      }
      lessonByChapter.get(l.chapterId).push({
        ...l.lesson,
        topic: topicByLesson.get(l.lessonId) || [],
      });
    }

    for (const c of chapters) {
      if (!chapterByModule.has(c.moduleId)) {
        chapterByModule.set(c.moduleId, []);
      }
      chapterByModule.get(c.moduleId).push({
        ...c.chapter,
        lesson: lessonByChapter.get(c.chapterId) || [],
      });
    }

    return {
      module: modules.map((m) => ({
        ...m.module,
        chapter: chapterByModule.get(m.moduleId) || [],
      })),
    };
  }

  async createDraftWithClone(courseId: string, tenantId: string, sourceCourseVersionId: string, versionName: string) {
    return this.prisma.$transaction(async (tx) => {
      // ---------------- CHECK EXISTING DRAFT ----------------
      const existingDraft = await tx.courseVersion.findFirst({
        where: {
          courseId,
          status: CourseStatus.DRAFT,
        },
      });

      if (existingDraft) {
        return {
          message: 'Draft already exists',
          courseVersionId: existingDraft.id,
        };
      }

      // ---------------- CREATE NEW VERSION ----------------
      const newVersion = await tx.courseVersion.create({
        data: {
          courseId,
          tenantId,
          versionName,
          status: CourseStatus.DRAFT,
          sourceVersionId: sourceCourseVersionId,
        },
      });

      // ---------------- FETCH MAPS ----------------
      const [moduleMaps, chapterMaps, lessonMaps, topicMaps, subTopicMaps] = await Promise.all([
        tx.moduleMap.findMany({
          where: { courseVersionId: sourceCourseVersionId },
        }),
        tx.chapterMap.findMany({
          where: { courseVersionId: sourceCourseVersionId },
        }),
        tx.lessonMap.findMany({
          where: { courseVersionId: sourceCourseVersionId },
        }),
        tx.topicMap.findMany({
          where: { courseVersionId: sourceCourseVersionId },
        }),
        tx.subTopicMap.findMany({
          where: { courseVersionId: sourceCourseVersionId },
        }),
      ]);

      // ---------------- CLONE MODULE MAP ----------------
      if (moduleMaps.length) {
        await tx.moduleMap.createMany({
          data: moduleMaps.map((m) => ({
            moduleId: m.moduleId,
            courseVersionId: newVersion.id,
            orderIndex: m.orderIndex,
          })),
        });
      }

      // ---------------- CLONE CHAPTER MAP ----------------
      if (chapterMaps.length) {
        await tx.chapterMap.createMany({
          data: chapterMaps.map((c) => ({
            chapterId: c.chapterId,
            moduleId: c.moduleId,
            courseVersionId: newVersion.id,
            orderIndex: c.orderIndex,
          })),
        });
      }

      // ---------------- CLONE LESSON MAP ----------------
      if (lessonMaps.length) {
        await tx.lessonMap.createMany({
          data: lessonMaps.map((l) => ({
            lessonId: l.lessonId,
            chapterId: l.chapterId,
            courseVersionId: newVersion.id,
            orderIndex: l.orderIndex,
          })),
        });
      }

      // ---------------- CLONE TOPIC MAP ----------------
      if (topicMaps.length) {
        await tx.topicMap.createMany({
          data: topicMaps.map((t) => ({
            topicId: t.topicId,
            lessonId: t.lessonId,
            courseVersionId: newVersion.id,
            orderIndex: t.orderIndex,
          })),
        });
      }

      // ---------------- CLONE SUBTOPIC MAP ----------------
      if (subTopicMaps.length) {
        await tx.subTopicMap.createMany({
          data: subTopicMaps.map((s) => ({
            subTopicId: s.subTopicId,
            topicId: s.topicId,
            courseVersionId: newVersion.id,
            orderIndex: s.orderIndex,
          })),
        });
      }

      return {
        message: 'Draft version created successfully',
        courseVersionId: newVersion.id,
      };
    });
  }
}
