import { forwardRef, Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { UserModule } from 'src/user/user.module';
import { DataIngestionModule } from 'src/data-ingestion/data-ingestion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    UserModule,
    forwardRef(() => DataIngestionModule),
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
