import { HttpStatus, HttpException } from '@nestjs/common';

export const BUSINESS_ERROR_CODE = {
  // 公共错误码
  COMMON: 10001,
  // 特殊错误码
  TOKEN_INVALID: 10002,
  // 禁止访问
  ACCESS_FORBIDDEN: 10003,
  // 权限已禁用
  PERMISSION_DISABLED: 10003,
  // 用户已冻结
  USER_DISABLED: 10004,
};

interface BusinessError {
  code: number;
  message: string;
}

export class BusinessException extends HttpException {
  constructor(err: BusinessError | string) {
    if (typeof err === 'string') {
      err = {
        code: BUSINESS_ERROR_CODE.COMMON,
        message: err,
      };
    }
    super(err, HttpStatus.OK);
  }

  static throwForbidden() {
    throw new BusinessException({
      code: BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN,
      message: '禁止访问',
    });
  }
}
