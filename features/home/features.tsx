import ImageFallback from "@/components/image-fallback";

export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: "Shipping All over Egypt",
      description: "Free shipping on all order or order above 25k",
      icon: "/images/shipping-icon.png",
    },
    {
      id: 2,
      title: "After sales service",
      description: "Simply return it within 30 days for an exchange.",
      icon: "/images/service-icon.png",
    },
    {
      id: 3,
      title: "Security Payment",
      description: "We ensure secure payment with PEV",
      icon: "/images/security-icon.png",
    },
    {
      id: 4,
      title: "24/7 Support",
      description: "Contact us 24 hours a day, 7 days a week",
      icon: "/images/support-icon.png",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageFallback
                  src={feature.icon}
                  alt={feature.title}
                  className="size-12 object-contain"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
