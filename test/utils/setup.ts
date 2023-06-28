import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TestDatabaseManagementService {
  constructor(private readonly connection: DataSource) {}

  async clearDatabase() {
    const entities = this.connection.entityMetadatas;

    for (const entity of entities) {
      const repository = this.connection.getRepository(entity.name);
      await repository.clear();
    }
  }
}
