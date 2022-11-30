import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FanupService } from '../service/fanup.service';
import {
  LoggingInterceptor,
  TransformInterceptor,
} from '../../../common/interceptor';
import { CreateTimeDto, UpdateTimeDto } from '../dto';
import { SetResponse } from 'src/common/decorator';
import { ResMessage, ResStatusCode } from 'src/common/constants';
import { AllRPCExceptionFilter } from 'src/common/filter';

@UseFilters(new AllRPCExceptionFilter())
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller()
export class FanupController {
  constructor(private readonly fanupService: FanupService) {}

  @SetResponse(ResMessage.CREATE_FANUP, ResStatusCode.CREATED)
  @MessagePattern('createFanUP')
  async create(data: CreateTimeDto) {
    return await this.fanupService.create(data.start_time, data.end_time);
  }

  @SetResponse(ResMessage.UPDATE_FANUP, ResStatusCode.OK)
  @MessagePattern('updateFanUP')
  async update(data: UpdateTimeDto) {
    return await this.fanupService.update(data.room_id, {
      start_time: data.start_time,
      end_time: data.end_time,
    });
  }

  @SetResponse(ResMessage.GET_ALL_FANUP_BY_TICKET, ResStatusCode.OK)
  @MessagePattern('findAllByTicketId')
  async findAllByTicketId(data: { ticket_id: number }) {
    return await this.fanupService.findAllByTicketId(data.ticket_id);
  }

  @SetResponse(ResMessage.FANUP_EXIST, ResStatusCode.OK)
  @MessagePattern('isFanUPExist')
  async isExist(data: { room_id: string }) {
    return await this.fanupService.isExist(data.room_id);
  }
}