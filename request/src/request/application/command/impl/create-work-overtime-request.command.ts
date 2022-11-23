export class CreateWorkOvertimeRequestCommand {
  constructor(
    public readonly message: string,
    public readonly approverId: string,
    public readonly ccTo: string[],
    public readonly date: [string, string][],
    public readonly requesterId: string,
  ) {}
}
