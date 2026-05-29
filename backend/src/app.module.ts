import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { RepairsModule } from './repairs/repairs.module';
import { MigrationModule } from './migrations/migration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    MigrationModule,
    HealthModule,
    AuthModule,
    InventoryModule,
    SalesModule,
    RepairsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
