import LayoutHeader from "./components/Layout/Header";
import LayoutMain from "./components/Layout/Main";
import LayoutSide from "./components/Layout/Side";

function App() {
  return (
    <main className=" h-[100vh] p-4">
      <LayoutHeader />
      <div className="flex justify-between">
        <div className="flex-1 m-4 mt-0 mr-0 rounded-sm">
          <LayoutMain />
        </div>
        <div className="mx-6 bg-white w-72 app-card ">
          <LayoutSide />
        </div>
      </div>
    </main>
  );
}

export default App;
