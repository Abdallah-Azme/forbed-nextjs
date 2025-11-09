"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const blogs = [
  {
    title: "مقدمة عن أفضل أنواع المراتب في مصر",
    image: "/mattress.png",
    excerpt:
      "اختيار المرتبة المناسبة يساعد في توفير راحة دائمة للنوم. في هذا المقال نستعرض أفضل أنواع المراتب الموجودة في مصر.",
    comments: "1 comment",
  },
  {
    title: "ماهي المراتب الطبية؟",
    image: "/mattress.png",
    excerpt:
      "تعتبر المراتب الطبية من الأنواع الأكثر انتشارًا لتحسين صحة العمود الفقري والنوم الصحي. تعرف على ميزاتها.",
    comments: "1 comment",
  },
  {
    title: "تعرف ايه عن مراتب فورد الطبية؟",
    image: "/mattress.png",
    excerpt:
      "كل اللي محتاج تعرفه عن مراتب فورد الطبية من حيث الجودة والراحة. اختيار مثالي للنوم الصحي والدعم الكامل للجسم.",
    comments: "1 comment",
  },
  {
    title: "ايه الفرق بين السوست المنفصلة والمتصلة؟",
    image: "/mattress.png",
    excerpt:
      "تعرف على الفرق بين مراتب السوست المنفصلة والمتصلة، وأيها الأفضل لك حسب احتياجاتك وراحتك أثناء النوم.",
    comments: "2 comments",
  },
];

export function BlogSection() {
  return (
    <section
      dir="rtl"
      className="container mx-auto py-12 px-4 text-right space-y-8"
    >
      <h2 className="text-3xl font-bold text-center">المقالات</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog, i) => (
          <Card
            key={i}
            className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <CardHeader className="p-0">
              <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-contain p-6"
                />
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-lg leading-snug">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {blog.excerpt}
              </p>
              <p className="text-xs text-gray-500 mt-2">{blog.comments}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="default" className="rounded-full px-8">
          عرض الكل
        </Button>
      </div>
    </section>
  );
}
