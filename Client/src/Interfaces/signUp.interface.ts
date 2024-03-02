export interface ISignUp {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirm_password: string;
  membership_type: "regular" | "premium";
  member: "guest" | "member";
}
