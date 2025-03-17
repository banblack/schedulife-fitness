
import { useProfileForm } from "@/hooks/useProfileForm";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { PersonalInfo } from "@/components/profile/PersonalInfo";
import { PhysicalInfo } from "@/components/profile/PhysicalInfo";
import { BioAndGoals } from "@/components/profile/BioAndGoals";
import { SetupProgress } from "@/components/profile/SetupProgress";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { SaveProfileButton } from "@/components/profile/SaveProfileButton";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import CoachingPlans from "@/components/subscription/CoachingPlans";

const Profile = () => {
  const {
    profile,
    setProfile,
    errors,
    bmi,
    loading,
    handleInputChange,
    handleSave
  } = useProfileForm();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ProfileContainer>
      <ProfileHeader />
      
      <SetupProgress />

      <div className="space-y-8">
        <ProfileAvatar 
          imageUrl={profile.imageUrl} 
          onImageUpdate={(url) => setProfile(prev => ({ ...prev, imageUrl: url }))}
        />

        <PersonalInfo
          name={profile.name}
          email={profile.email}
          errors={errors}
          onChange={handleInputChange}
        />

        <PhysicalInfo
          height={profile.height}
          weight={profile.weight}
          bmi={bmi}
          errors={errors}
          onChange={handleInputChange}
        />

        <BioAndGoals
          bio={profile.bio}
          fitnessGoals={profile.fitnessGoals}
          onChange={handleInputChange}
        />

        <SaveProfileButton onClick={handleSave} />

        <section className="mt-12">
          <CoachingPlans />
        </section>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
