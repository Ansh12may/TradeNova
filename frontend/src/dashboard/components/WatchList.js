import React, { useContext, useMemo, useState } from "react";
import { watchlist } from "../data/data";
import { Tooltip, Grow } from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  BarChartOutlined,
  MoreHoriz,
} from "@mui/icons-material";
import GeneralContext from "./GeneralContext";

const WatchList = () => {
  const [query, setQuery] = useState("");

  const filteredWatchlist = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return watchlist;
    }

    return watchlist.filter((stock) =>
      stock.name.toLowerCase().includes(value)
    );
  }, [query]);

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search stocks"
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <span className="counts">
          {filteredWatchlist.length} / {watchlist.length}
        </span>
      </div>

      <ul className="list">
        {filteredWatchlist.map((stock) => (
          <WatchListItem
            stock={stock}
            key={stock.name}
          />
        ))}
      </ul>
    </div>
  );
};

export default WatchList;

// WATCHLIST ITEM

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] =
    useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>
          {stock.name}
        </p>

        <div className="itemInfo">
          <span className="percent">
            {stock.percent}
          </span>

          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}

          <span className="price">
            {stock.price}
          </span>
        </div>
      </div>

      {showWatchlistActions && (
        <WatchListActions
          uid={stock.name}
          price={stock.price}
        />
      )}
    </li>
  );
};



// WATCHLIST ACTIONS

const WatchListActions = ({ uid, price }) => {
  const { openBuyWindow } = useContext(GeneralContext);

  return (
    <span className="actions">
      <span>

        {/* BUY */}
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button
            className="buy"
            onClick={() =>
              openBuyWindow(uid, price, "BUY")
            }
          >
            Buy
          </button>
        </Tooltip>


        {/* SELL */}
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button
            className="sell"
            onClick={() =>
              openBuyWindow(uid, price, "SELL")
            }
          >
            Sell
          </button>
        </Tooltip>


        {/* ANALYTICS */}
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button
            className="action"
            type="button"
          >
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>


        {/* MORE */}
        <Tooltip
          title="More"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button
            className="action"
            type="button"
          >
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>

      </span>
    </span>
  );
};