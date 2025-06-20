import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: '姓名不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsNotEmpty({ message: '电话不能为空' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: '留言内容不能为空' })
  @IsString()
  content: string;
}
