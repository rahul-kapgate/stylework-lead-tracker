export function AppHeader() {
  return (
    <header
      className="
        sticky
        top-0
        z-50

        border-b
        border-[#DCE8E1]

        bg-[#FBFDFC]/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-[1440px]
          items-center

          px-5
          sm:px-6
          lg:px-8
        "
      >
        <a
          href="/"
          aria-label="Stylework home"
          className="
            group
            inline-flex
            items-center
            gap-3

            rounded-lg

            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-brand-100
          "
        >
          <div
            className="
              flex
              size-9
              items-center
              justify-center

              overflow-hidden
              rounded-lg

              border
              border-[#D8E5DD]

              bg-white

              shadow-[0_1px_3px_rgba(21,70,43,0.08)]

              transition-all
              duration-200

              group-hover:border-[#BED5C7]
              group-hover:shadow-[0_3px_10px_rgba(21,70,43,0.10)]
            "
          >
            <img
              src="/image.png"
              alt=""
              className="
                size-6
                object-contain
              "
            />
          </div>

          <span
            className="
              text-[17px]
              font-semibold
              tracking-[-0.025em]
              text-[#17211C]
            "
          >
            Stylework
          </span>
        </a>
      </div>
    </header>
  );
}
