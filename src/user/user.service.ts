import { Injectable } from '@nestjs/common'
import { CreateUserDto, CreateUserResponseDTO } from './dto/CreateUser.dto'
import { UserRepository } from './repository/user.repository'

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  //   async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponseDTO> {
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { currentJobDetail, ...userData } = createUserDto
    // const user: User = await this.repository.createUser(userData)
    // const resCurrentJobDetail: CurrentJobDetail | null = null
    // if (currentJobDetail != null && currentJobDetail != undefined) {
    //   resCurrentJobDetail = await this.repository.createCurrentJobDetail({
    //     ...currentJobDetail,
    //     userId: user.userId
    //   })
    // }
    const res = await this.repository.createUser(userData)
    // return res
  }
}
