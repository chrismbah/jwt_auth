export type User = {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    is_active: number;
    last_login?: Date;
    created_at: Date;
    updated_at: Date;
    password_hash: string;
  };