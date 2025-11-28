// @see https://www.landingfolio.com/library

import Image from 'next/image'

export const footerNav = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Features', href: '#features' },
      { label: 'Works', href: '#works' },
      { label: 'Career', href: '/careers' }
    ]
  },
  {
    title: 'Help',
    links: [
      { label: 'Customer Support', href: '/support' },
      { label: 'Delivery Details', href: '/delivery' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' }
    ]
  }
]

export const socialLinks = []

const Footer = () => (
  <section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
    <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
      <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-4 gap-y-16 gap-x-12">
        <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
          <Image
            className="w-auto"
            width={150}
            height={46}
            src="https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg"
            alt="logo"
          />
          <p className="text-base leading-relaxed text-gray-600 mt-7">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit.
          </p>

          <ul className="flex items-center space-x-3 mt-9">
            {socialLinks.map(({ name, icon }) => (
              <li key={name}>
                <a
                  aria-label={name}
                  className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600"
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {footerNav.map(({ title, links }) => (
          <nav key={title}>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">{title}</p>
            <ul className="mt-6 space-y-4">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex text-base text-333 transition-all duration-200 hover:text-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <hr className="mt-16 mb-10 border-gray-200" />

      <p className="text-sm text-center text-gray-600">
        © Copyright 2025, All Rights Reserved by SongMing
      </p>
    </div>
  </section>
)

export default Footer
