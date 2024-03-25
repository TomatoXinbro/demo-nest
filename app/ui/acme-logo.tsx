import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/potato.jpg"
        alt="error"
        width={50}
        height={50}
        className="mr-[12px] rounded-[50%]"
      />
      <p className="text-[44px]">Potato</p>
    </div>
  );
}
