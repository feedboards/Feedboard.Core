export interface IToken<TClass, TDto> {
    isLogged: () => boolean;
    getActiveToken: () => TClass;
    getActiveTokenAsResponseDto: () => TDto;
    addTokenOrUpdate: (token: TDto) => TClass
}