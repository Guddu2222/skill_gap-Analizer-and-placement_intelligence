import React from "react";
import MinimalAuthForm from "../../components/auth/MinimalAuthForm";
import { Briefcase } from "lucide-react";

const RecruiterSignup = () => {
  return (
    <MinimalAuthForm
      role="recruiter"
      title="Create Recruiter Account"
      subtitle="Find top talent aligned with your domain requirements."
      icon={Briefcase}
      namePlaceholder="Company Name"
    />
  );
};

export default RecruiterSignup;
