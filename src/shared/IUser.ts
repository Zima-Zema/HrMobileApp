export interface IUser {
    AuthenticationType: string
    CompanyId: number
    Culture: string
    Email: string
    EmpId: number
    Id: string
    IsAuthenticated: boolean
    Language: string
    Locked: boolean
    Name: string
    ResetPassword: boolean
    UserName: string
    Roles:Array<string>
}