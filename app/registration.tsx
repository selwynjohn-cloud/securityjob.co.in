import { useRouter } from 'expo-router';
import { TalkingGuideSession } from '@/src/components/TalkingGuideSession';

/**
 * Video-style talk & record registration:
 * Guide speaks the question → candidate answers by voice → confirm → next.
 */
export default function RegistrationScreen() {
  const router = useRouter();

  return (
    <TalkingGuideSession
      onFinished={() => {
        router.push('/confirmation');
      }}
    />
  );
}
