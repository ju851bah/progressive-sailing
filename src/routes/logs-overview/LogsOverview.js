import React, { lazy } from 'react';
import { Link } from 'react-router-dom';
import { LogEntry } from '../../components/log-entry/LogEntry';
import './LogsOverview.css'
import { connect } from 'react-redux';
import { getLogs, getSelectedLog } from '../../redux/selectors';
import { selectLog } from '../../redux/actions';

const LogDetails = lazy(() => import('../../routes/log-details/LogDetails'));

const mapStateToProps = state => {
  return {
    logs: getLogs(state),
    selectedLog: getSelectedLog(state)
  }
};

class LogsOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      selectedLog: null,
      logs: null
    };
    this.selectLog = this.selectLog.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('resize',
      this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({
      width: window.innerWidth,
    });
  };

  componentDidMount() {
    window.addEventListener('resize',
      this.handleWindowSizeChange);
  }

  selectLog(log) {
    this.setState({selectedLog: log});
    this.props.selectLog(log.id, log.content)
  }

  render() {
    const {width} = this.state;
    const isMobile = width <= 500;

    if (isMobile) {
      return <MobileView logs={this.props.logs} selectLog={this.selectLog}/>;
    } else {
      return <DesktopView logs={this.props.logs} selectedLog={this.state.selectedLog} selectLog={this.selectLog} />

    }
  }
}

export default connect(mapStateToProps, { selectLog })(LogsOverview);

function DesktopView(props) {
  return (
    <div className={"logs-view"}>
      <div className={"log-list"}>
        {props.logs && props.logs.length
          ? props.logs.map((log, index) => {
            return <LogEntry key={`log-${log.id}`} logEntry={log} customClickEvent={props.selectLog.bind(this, log)}/>
          })
          : 'No Logs yet!'}
      </div>
      {!props.selectedLog && <div>Select Log</div>}
      {props.selectedLog && <LogDetails/>}
    </div>
  )
}

function MobileView(props) {
  return (
    <div className={"log-list App-content"}>
      {props.logs && props.logs.length
        ? props.logs.map((log, index) => {
          return <Link key={`log-${log.id}`}  to={{
            pathname: "/logs/details",
          }} onClick={props.selectLog.bind(this, log)}>
            <LogEntry logEntry={log}/>
          </Link>
        })
        : 'No Logs yet!'}
    </div>
  )
}