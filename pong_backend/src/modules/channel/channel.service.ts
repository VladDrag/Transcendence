import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/models/orm_models/channel.entity';
import { Repository } from 'typeorm';

export class UserRepository extends Repository<Channel> {}

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async findAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  async findOne(id: number): Promise<Channel> {
    return this.channelRepository.findOneBy({ ChannelId: id });
  }

  async create(user: Channel): Promise<Channel> {
    return this.channelRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }
}