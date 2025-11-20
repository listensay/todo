import LayoutMain from "./components/Layouts/Main";
import LayoutSide from "./components/Layouts/Side";

function App() {

  return (
    <main className="flex justify-between h-[100vh] p-4">
      <div className="flex-1 m-4 mt-0 mr-0 rounded-sm">
        <LayoutMain />
      </div>
      <div className="mx-6 bg-white w-72 app-card ">
        <LayoutSide />
      </div>
    </main>
  );
}

export default App;
