import React from "react";
import MinimalAuthForm from "../../components/auth/MinimalAuthForm";
import { Building2 } from "lucide-react";

const CollegeSignup = () => {
  return (
    <MinimalAuthForm
      role="college_admin"
      title="Create College Account"
      subtitle="Manage your institution's placement process efficiently."
      icon={Building2}
      namePlaceholder="College/Institution Name"
    />
  );
};

export default CollegeSignup;
