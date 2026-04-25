import React from "react";
import MinimalAuthForm from "../../components/auth/MinimalAuthForm";
import { User } from "lucide-react";

const StudentSignup = () => {
  return (
    <MinimalAuthForm
      role="student"
      title="Create Student Account"
      subtitle="Unlock AI skill analysis and placement tracking."
      icon={User}
      namePlaceholder="Full Name"
    />
  );
};

export default StudentSignup;
