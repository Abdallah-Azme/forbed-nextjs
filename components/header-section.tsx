import React from "react";
import { motion, easeOut } from "framer-motion";

export default function HeaderSection({ title }: { title: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ ease: easeOut }}
      viewport={{ once: true }}
      className="text-3xl font-bold w-fit  "
    >
      {title}
    </motion.h2>
  );
}
