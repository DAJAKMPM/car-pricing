import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1688531981037 implements MigrationInterface {
  name = 'InitialSchema1688531981037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "meeting" ("id" SERIAL NOT NULL, "zoomUrl" character varying NOT NULL, CONSTRAINT "PK_dccaf9e4c0e39067d82ccc7bb83" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "employeeId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contact_info" ("id" SERIAL NOT NULL, "phone" character varying, "email" character varying NOT NULL, "employeeId" integer, CONSTRAINT "REL_f188a018423a2cc75535509ff9" UNIQUE ("employeeId"), CONSTRAINT "PK_65b98fa4ffb26dceb9192f5d496" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "managerId" integer, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "admin" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "report" ("id" SERIAL NOT NULL, "price" integer NOT NULL, "make" character varying NOT NULL, "model" character varying NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "approved" boolean NOT NULL DEFAULT false, "mileage" integer NOT NULL, "userId" integer, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee_meetings_meeting" ("employeeId" integer NOT NULL, "meetingId" integer NOT NULL, CONSTRAINT "PK_42c91b964b9c480aadec311fafb" PRIMARY KEY ("employeeId", "meetingId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0f0c3a58474a40670f633832aa" ON "employee_meetings_meeting" ("employeeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10f26ded70438524748ef34cd1" ON "employee_meetings_meeting" ("meetingId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_07278e1532a8daa462123fb7bc1" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_info" ADD CONSTRAINT "FK_f188a018423a2cc75535509ff97" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_f4a920dfa304e096fad40e8c4a0" FOREIGN KEY ("managerId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_meetings_meeting" ADD CONSTRAINT "FK_0f0c3a58474a40670f633832aa8" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_meetings_meeting" ADD CONSTRAINT "FK_10f26ded70438524748ef34cd10" FOREIGN KEY ("meetingId") REFERENCES "meeting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_meetings_meeting" DROP CONSTRAINT "FK_10f26ded70438524748ef34cd10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_meetings_meeting" DROP CONSTRAINT "FK_0f0c3a58474a40670f633832aa8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_e347c56b008c2057c9887e230aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_f4a920dfa304e096fad40e8c4a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_info" DROP CONSTRAINT "FK_f188a018423a2cc75535509ff97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_07278e1532a8daa462123fb7bc1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10f26ded70438524748ef34cd1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0f0c3a58474a40670f633832aa"`,
    );
    await queryRunner.query(`DROP TABLE "employee_meetings_meeting"`);
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "employee"`);
    await queryRunner.query(`DROP TABLE "contact_info"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "meeting"`);
  }
}
