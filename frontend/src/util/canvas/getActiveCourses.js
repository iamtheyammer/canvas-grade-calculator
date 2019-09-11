import moment from 'moment';

export default courses =>
  courses.filter(c => !c.end_at || moment(c.end_at).isAfter(/* now */));
