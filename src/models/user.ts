export class User {
  constructor(public id: string,
              public first_name: string,
              public last_name: string,
              public email_address: string,
              public username: string,
              public validated: string,
              public blocked: string,
              public created_at: string,
              public updated_at: string
  ) {}
}