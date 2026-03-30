export default function CartPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-1 flex-col px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Cart
      </h1>
      <p className="mt-2 max-w-[1450px] text-zinc-700">
        Your cart is empty. Hook this page up to checkout when you are ready.
      </p>
    </div>
  );
}
