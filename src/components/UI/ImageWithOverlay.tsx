import Image from 'next/image';

type ImgProps = {
  size: number;
  src: string;
  alt: string;
};

export default function ImageWithOverlay({
  mainImg,
  overlayImg,
  hideOverlay,
}: {
  mainImg: ImgProps;
  overlayImg: ImgProps;
  hideOverlay?: boolean;
}) {
  return (
    <div className="relative">
      <Image
        width={mainImg.size}
        height={mainImg.size}
        src={mainImg.src}
        alt={mainImg.alt}
        className="rounded-full flex-shrink-0 "
      />
      {!hideOverlay && (
        <Image
          width={overlayImg.size}
          height={overlayImg.size}
          src={overlayImg.src}
          alt={overlayImg.alt}
          className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full border border-gray-200 flex-shrink-0"
        />
      )}
    </div>
  );
}
