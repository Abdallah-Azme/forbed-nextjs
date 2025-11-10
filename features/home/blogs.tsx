"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ImageFallback from "@/components/image-fallback";

const blogs = [
  {
    title: "مقدمة عن أفضل أنواع المراتب في مصر",
    image: "/mrtba.webp",
    excerpt:
      "اختيار المرتبة المناسبة يساعد في توفير راحة دائمة للنوم. في هذا المقال نستعرض أفضل أنواع المراتب الموجودة في مصر.",
  },
  {
    title: "ماهي المراتب الطبية؟",
    image: "/mrtba.webp",
    excerpt:
      "تعتبر المراتب الطبية من الأنواع الأكثر انتشارًا لتحسين صحة العمود الفقري والنوم الصحي. تعرف على ميزاتها.",
  },
  {
    title: "تعرف ايه عن مراتب فورد الطبية؟",
    image: "/mrtba.webp",
    excerpt:
      "كل اللي محتاج تعرفه عن مراتب فورد الطبية من حيث الجودة والراحة. اختيار مثالي للنوم الصحي والدعم الكامل للجسم.",
  },
  {
    title: "ايه الفرق بين السوست المنفصلة والمتصلة؟",
    image: "/mrtba.webp",
    excerpt:
      "تعرف على الفرق بين مراتب السوست المنفصلة والمتصلة، وأيها الأفضل لك حسب احتياجاتك وراحتك أثناء النوم.",
  },
];

export function BlogSection() {
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section className="container mx-auto py-12 px-4 space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center"
      >
        المقالات
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="flex flex-col overflow-hidden shadow-sm h-auto hover:shadow-md transition-all duration-300 bg-white pt-0">
              <CardHeader className="p-0">
                <div className="relative w-full h-48">
                  <ImageFallback
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-lg leading-snug text-right">
                  {blog.title}
                </h3>
                <p className="text-sm  min-h-[70px] text-gray-600 leading-relaxed line-clamp-3 text-right">
                  {blog.excerpt}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="flex justify-center pt-4"
      >
        <Button variant="default" className="px-8 py-6 rounded-none">
          عرض الكل
        </Button>
      </motion.div>
    </section>
  );
}
