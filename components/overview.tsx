import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-16 items-center">
          <Image
            src="/srh/images/bsu-logo.png"
            alt="BSU logo"
            width={140}
            height={30}
          />
          <Image
            src="/srh/images/gu-logo.png"
            alt="GU logo"
            width={100}
            height={10}
          />
        </p>
        <p>
          This is an AI chatbot by{' '}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://bsu.gu.ac.ug/"
            target="_blank"
          >
            Building Stronger Universities
          </Link>{' '}
          (BSU)-Gulu in conjuntion with{' '}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://gu.ac.ug/"
            target="_blank"
          >
            Gulu University
          </Link>{' '}
          to offer judgment-free, informative, 
          and up-to-date information on sexual and reproductive health, 
          from contraception and STIs to pregnancy and wellness.
        </p>
        {/* <p>
          You can learn more about the AI SDK by visiting the{' '}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://sdk.vercel.ai/docs"
            target="_blank"
          >
            docs
          </Link>
          .
        </p> */}
      </div>
    </motion.div>
  );
};
