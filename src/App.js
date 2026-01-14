import React, { useEffect, useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline' 
import { Link, Routes, Route } from 'react-router-dom'
import { InvoiceProvider } from './Components/InvoiceContext'
import InvoicePage from './Components/InvoicePage'
import SummaryPage from './Components/SummaryPage'
import NewInvoicePage from './Components/NewInvoicePage'
import ImageCarousel from './Components/ImageCarousel'  

const user = {
  name: 'Garv',
  email: 'gj@gmail.com',
  
}
const navigation = [
  { name: 'Invoice', href: '/', current: true },
  { name: 'Summary', href: '/summary', current: false },
  { name: 'New Invoice', href: '/newinvoice', current: false },
  
]
const userNavigation = [
  { name: 'Your profile', href: '#' },

]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'day')

  const [activeName, setActiveName] = useState(() => {
    const p = window.location.pathname === '/' ? '/' : window.location.pathname
    return navigation.find((n) => n.href === p)?.name || navigation[0].name
  })

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <InvoiceProvider>
      <div className="min-h-full bg-slate-300 dark:bg-black transition-colors duration-200">
        <Disclosure as="nav" className="bg-blue-800 dark:bg-blue-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
            <div className="absolute inset-x-0 flex justify-center md:hidden">
              <Link to="/" className="text-white font-semibold text-lg">QuistonPe</Link>
            </div>
              <div className="flex items-center">
                <div className="shrink-0">
                  <Link to="/" className="hidden md:block text-white font-semibold text-lg">QuistonPe</Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setActiveName(item.name)}
                        aria-current={item.name === activeName ? 'page' : undefined}
                        className={classNames(
                          item.name === activeName
                            ? 'bg-black/50 dark:bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </Link>
                    ))} 
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme(theme === 'dark' ? 'day' : 'dark')}
                    className="ml-3 rounded-md px-2 py-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                    aria-pressed={theme === 'dark'}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>

         
                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <span className="sr-only">{user.name}</span> 
                    </MenuButton>

                    <MenuItems
                      transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black dark:bg-gray-800 py-1 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <a
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                          >
                            {item.name}
                          </a>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  onClick={() => setActiveName(item.name)}
                  aria-current={item.name === activeName ? 'page' : undefined}
                  className={classNames(
                    item.name === activeName ? 'bg-black/50 dark:bg-gray-700 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}  
            </div>
            <div className="border-t border-white/10 pt-4 pb-3">
              <div className="flex items-center px-5">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-medium">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base/5 font-medium text-slate-900 dark:text-white">{user.name}</div>
                  <div className="text-sm font-medium text-gray-400">{user.email}</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-3 px-2">
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'day' : 'dark')}
                  className="w-full rounded-md px-3 py-2 text-left text-gray-400 hover:bg-white/5 hover:text-white"
                  aria-pressed={theme === 'dark'}
                >
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>


        <div className="w-full">
          <ImageCarousel />
        </div>

        <header className="relative bg-gray-600 dark:bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          
         
          </div>
        </header> 
        <main>
          <Routes>
            <Route path="/" element={<InvoicePage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/newinvoice" element={<NewInvoicePage />} />
          </Routes>
        </main>

        <footer className="bg-white dark:bg-white text-gray-500 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm">&copy; {new Date().getFullYear()} Quistonpe. All rights reserved.</div>
              <div className="mt-3 sm:mt-0 flex space-x-4">
                <Link to="/about" className="text-sm text-gray-500 hover:text-blue-700">About</Link>
                <Link to="/contact" className="text-sm text-gray-500 hover:text-blue-700">Contact</Link>
                <a href="/privacy" className="text-sm text-gray-500 hover:text-blue-700">Privacy</a>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Quistonpe helps you create and manage invoices, track summaries, and export your data quickly and securely.
            </div>
          </div>
        </footer>

      </div>
    </InvoiceProvider>
  )
}
