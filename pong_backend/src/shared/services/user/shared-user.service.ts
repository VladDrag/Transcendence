import { Injectable } from '@nestjs/common';
// import { User } from 'src/models/mock_data/local_models';
import { PublicUser } from '../../interfaces/user/public_user.interface';
import { FriendUser } from '../../interfaces/user/friend_user.interface';
import { User, StatusValue } from 'src/models/orm_models/user.entity';
import { Friend } from 'src/models/orm_models/friend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SharedUser {

    constructor(
        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}



    async isFriend(myID:number, friendID:number): Promise<boolean> //todo: Test this
    {
        const friend = await this.friendRepository.findOne({ where: { user: { userID: myID }, friendUser: { userID: friendID } } });
        return !!friend;
    }

    async getUsers(): Promise<PublicUser[]> //todo: Test this
    {
        const users = await this.userRepository.find();
        return users.map(user => ({userId: user.userID, nickname: user.username}));
    }

    findUser(userID:number)
    {
        return (true)
    }

    async getFriends(myID: number): Promise<FriendUser[]> // todo: Ready to test
    {
        const friends = await this.friendRepository.find({ where: { user: { userID: myID } } });
        const friendUsers = await Promise.all(friends.map(async (friend) => {
            const user = await this.userRepository.findOne({ where: { userID: friend.friendUser.userID } });
        return {
            userId: user.userID,
            nickname: user.username,
            status: user.status
        };
        }));
    return friendUsers;
    }
}