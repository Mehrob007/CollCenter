import PropTypes from "prop-types";

export default function Item({ stylesItem, active, data, keys }) {
  console.log("item", data);
  console.log("item", data);

  return (
    <div style={stylesItem} >
      {keys.map((e, i) => (
        <span key={i}>{data?.[e] || "Не найдено!"}</span>
      ))}
      {active.map((e, i) => (
        <div key={i}>
          <img onClick={() => e.function(data)} src={e.icon} alt="iconItem" />
        </div>
      ))}
    </div>
  );
}
Item.propTypes = {
  data: PropTypes.objectOf(PropTypes.string),
  stylesItem: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  keys: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.arrayOf(
    PropTypes.shape({
      function: PropTypes.func.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ),
};
