import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectRepository {
  async findAll() {
    return prisma.project.findMany({
      include: { _count: { select: { reports: true } } }
    });
  }

  async findById(id: number) {
    return prisma.project.findUnique({
      where: { id }
    });
  }

  async create(data: { name: string; description?: string }) {
    return prisma.project.create({ data });
  }

  async update(id: number, data: any) {
    return prisma.project.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    return prisma.project.delete({
      where: { id }
    });
  }
}