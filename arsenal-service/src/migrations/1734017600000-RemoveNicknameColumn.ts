import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNicknameColumn1734017600000 implements MigrationInterface {
    name = 'RemoveNicknameColumn1734017600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nickname"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "nickname" character varying NOT NULL`);
    }
} 