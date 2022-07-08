import { CheckIcon } from "@heroicons/react/solid";
import React from "react";

function Table({ plans, selectedPlan }) {
  return (
    <table>
      <tbody className="divide-y divide-[gray]">
        <tr className="tableRow">
          <td className="tableDataTitle">Monthly price</td>
          {plans.map((plan) => (
            <td
              key={plan.id}
              className={`tableDataFeature ${
                selectedPlan.id === plan.id ? "text-[#e50924]" : "text-[gray]"
              }`}
            >
              {plan.price / 100} PLN
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">Video quality</td>
          {plans.map((plan) => (
            <td
              key={plan.id}
              className={`tableDataFeature ${
                selectedPlan.id === plan.id ? "text-[#e50924]" : "text-[gray]"
              }`}
            >
              {plan.meta.videoQuality}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">Resolution</td>
          {plans.map((plan) => (
            <td
              key={plan.id}
              className={`tableDataFeature ${
                selectedPlan.id === plan.id ? "text-[#e50924]" : "text-[gray]"
              }`}
            >
              {plan.meta.resolution}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">
            Watch on yout TV, computer, mobile phone and table
          </td>
          {plans.map((plan) => (
            <td
              key={plan.id}
              className={`tableDataFeature ${
                selectedPlan.id === plan.id ? "text-[#e50924]" : "text-[gray]"
              }`}
            >
              {plan.meta.mobile === "true" && (
                <CheckIcon className="inline-block h-8 w-8" />
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default Table;
