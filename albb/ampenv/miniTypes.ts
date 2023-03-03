
export type My = typeof my & {

  authorize(
    options: {
      scopes: string;
      success?(
        res: {
          authCode: string;
          authSucessScope: string;
          authErrorScope?: object;
        }
      ): void;
    }
  ): void;

  exit(): void;

  tb: any;

  qn: any;

  isIDE: boolean;

};
