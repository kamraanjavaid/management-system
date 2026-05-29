import { Module } from '@nestjs/common';
import { RepairsController } from './repairs.controller';
import { RepairsService } from './repairs.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [RepairsController],
  providers: [RepairsService],
})
export class RepairsModule {}
