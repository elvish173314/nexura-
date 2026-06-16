export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="text-xl font-black gradient-text">NEXORA</div>
          <p className="mt-2 text-sm text-neutral-500">The future of shopping. Premium products, world-class experience.</p>
        </div>
        <div>
          <h4 className="font-semibold">Shop</h4>
          <ul className="mt-2 space-y-1 text-sm text-neutral-500">
            <li>Electronics</li><li>Fashion</li><li>Home &amp; Kitchen</li><li>Sports</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Support</h4>
          <ul className="mt-2 space-y-1 text-sm text-neutral-500">
            <li>Order Tracking</li><li>Returns</li><li>Payment Help</li><li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Newsletter</h4>
          <p className="mt-2 text-sm text-neutral-500">Get deals in your inbox.</p>
          <form className="mt-3 flex gap-2">
            <input placeholder="Email" className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm" />
            <button className="btn-primary !px-3 !py-2 text-sm">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Nexora. Built with free &amp; open-source tech.
      </div>
    </footer>
  );
}
