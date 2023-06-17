import './App.css';
import Visualizer from './components/visualizer';


function App() {
  return (
    // <FlagsmithProvider
    //   options={{
    //     environmentID: 'FyA89scRGCQZqy7rAQaarB',
    //   }}
    //   flagsmith={flagsmith}>
      <div className="App">
        <Visualizer></Visualizer>
      </div>
    // {/* </FlagsmithProvider> */}
  );
}

export default App;
