import SectionHeader from '@/components/SectionHeader';
import { FaPlusCircle } from 'react-icons/fa';
import TribesBody from './_components/TribesBody';

const TribesPage = async () => {
  return (
    <div className="px-20">
      <SectionHeader
        name="All Available Tribes"
        buttonLink="/create-tribe"
        buttonTitle="Create Tribe"
        buttonIcon={<FaPlusCircle />}
      />
      <TribesBody />
    </div>
  );
};

export default TribesPage;