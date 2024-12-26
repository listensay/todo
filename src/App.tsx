import MainLayoutLeft from "./components/MainLayout/Left";
import MainLayoutRight from "./components/MainLayout/Right";

function App() {

  return (
    <main className="flex justify-between h-[100vh] p-4">
      <div className="flex-1 m-4 mr-0 rounded-sm">
        <MainLayoutRight />
      </div>
      <div className="mx-6 bg-white w-72 app-card ">
        <MainLayoutLeft />
      </div>
    </main>
  );
}

export default App;
