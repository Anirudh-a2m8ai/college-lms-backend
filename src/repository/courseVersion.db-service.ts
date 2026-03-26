import { Injectable } from '@nestjs/common';
import { Prisma, CourseVersion } from 'src/generated/prisma/client';
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
}
