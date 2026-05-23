export const product = {
  variants: [
    {
      id: "small",
      name: "Small",
      description: "Compact and lightweight. Fits in any bag.",
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAlElEQVR4nO3YsQ2AIBQGYcZhCIdwCCZxJoZwHBp7S23MS0zMAV5yA/xf8QpIrR1Dl/AFAugFAugFAugFAugFAugFAugFAugFvQByXsIECJgNcB+3lj3sC4wAAT0Car0SIOCPgOGPWICAF4BStjABAmYDPGGGedAIEODHFp8AOgF0AugE0AmgE0AngE4AnQA6AXQC6E7gA1G3GBlfkQAAAABJRU5ErkJggg==",
    },
    {
      id: "medium",
      name: "Medium",
      description: "The most popular size. Perfect for everyday use.",
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAkElEQVR4nO3WMQ2AQBBEUeQgAhGIOCVoQgRyaOhpaSiAC3OXvOT3O6/bYd+PrhviCwDSCwDSCwDSCwDSCwDSC/4GjONUPQCA1gHXY3PZqvcFAwCQBKzr+wAAAAAAAAAAegd0/8wBALwAlLJUDwAAAACgbcAdplZPNwAAJAGtBZAOIB1AOoB0AOkA0gGk6x5wApSCrtzOsuS9AAAAAElFTkSuQmCC",
    },
    {
      id: "large",
      name: "Large",
      description: "Maximum capacity. Built for the long haul.",
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABLklEQVR4AeySoQ3DQAxFrczQITpCQHlph+g4HaFDlDY4IOOEFDf8H/iyTGL7RzKw7nKy33/Tvv/+nWuy5p8ANBfABgPm+W6VCwMfAOCF6r0AVE+Y7UcNuN5elrnCANgD2c+pAdkXZPMLACOE58+H2ZkL52W9DGCEqp+3MwADFQAk0q2XAd0Sx31lABLp1suAbonjvjIAiXTrZUC3xHFfGYBEuvUyoHribD+3Ae+P2ZmLLYznbgD4QPZeALInGJ2fGnCxxTIXA0QBsAeynwtA9gSj88uAKMHs/8uA7AlG55cBUYLZ/5cB2RPE+b29DPASq3ZfBlRL1LuPDPASq3ZfBlRL1LsPNWBdF8tcDAgFwB7Ifj4A2LavVS4MbACAF6r3AlA9YbafDGCEzn4ene8AAAD//18ejxQAAAAGSURBVAMAgPGtn5QkiMMAAAAASUVORK5CYIIA",
    },
  ],
} as const;

export type Variant = (typeof product.variants)[number]["id"];
