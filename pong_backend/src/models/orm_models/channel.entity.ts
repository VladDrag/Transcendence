import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChannelAdmin } from './channel_admin.entity';
import { ChannelBlockedUser } from './channel_blocked_user.entity';
import { ChannelUser } from './channel_user.entity';

@Entity({ name: 'Channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  ChannelId: number;

  @Column()
  OwnerId: number;

  @Column()
  Name: string;

  @Column()
  Type: string;

  @Column()
  Password: string;

  @OneToMany(() => ChannelUser, (channelUsers) => channelUsers.channel)
  users: ChannelUser[];

  @OneToMany(
    () => ChannelBlockedUser,
    (channelBlockedUsers) => channelBlockedUsers.channel,
  )
  blockedUsers: ChannelBlockedUser[];

  @OneToMany(() => ChannelAdmin, (channelAdmins) => channelAdmins.channel)
  admins: ChannelAdmin[];
}
