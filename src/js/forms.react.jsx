import React from 'react';
import ReactDOM from 'react-dom';
import {
    $,
    extend,
    mobiscroll,
    classes,
    updateCssClasses,
    PropTypes,
    MbscOptimized,
    CorePropTypes
} from './frameworks/react';
import { Form } from './classes/forms';
import { Progress } from './classes/progress';
import { Slider } from './classes/slider';
import { Rating } from './classes/rating';
import './page.react';

var reactNumber = PropTypes.number,
    reactString = PropTypes.string,
    reactFunc = PropTypes.func,
    reactBool = PropTypes.bool;

/** PropTypes for Form components */
const StepperPropTypes = {
    onInit: reactFunc,
    onChange: reactFunc,
    value: reactNumber,
    disabled: reactBool,
    min: reactNumber,
    max: reactNumber,
    step: reactNumber,
    val: PropTypes.oneOf(['left', 'right'])
};

const SwitchPropTypes = {
    onInit: reactFunc,
    onChange: reactFunc,
    checked: reactBool,
    disabled: reactBool,
    value: reactBool
};


class MbscForm extends MbscOptimized {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        renderForm: true
    }

    static propTypes = {
        ...CorePropTypes,
        onInit: reactFunc
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new Form(ReactDOM.findDOMNode(this), settings);
    }

    componentDidUpdate = () => {
        if (!this.optimizeUpdate.updateOptions && this.optimizeUpdate.updateChildren) {
            this.instance.refresh(true);
        }
    }

    checkFormWrapper = (component) => {
        if (React.Children.count(component.props.children) == 1) {
            return (component.props.children.type == 'form');
        }
        return false;
    }

    render = () => {
        // passing through some of the element properties to its children
        var {
            action,
            method,
            noValidate,
            renderForm,
            name,
            target,
            autoComplete,
            onSubmit
        } = this.props;
        if (this.checkFormWrapper(this) || !renderForm) {
            return this.props.children;
        } else {
            return <form className={this.initialCssClass} action={action} name={name} target={target} method={method} autoComplete={autoComplete} noValidate={noValidate} onSubmit={onSubmit}>{this.props.children}</form>;
        }
    }
}

mobiscroll.Form = MbscForm;

class MbscLabel extends React.Component {
    constructor(props) {
        super(props);
        this.initialCssClass = (this.props.className || '') + (this.props.valid === undefined || this.props.valid ? '' : ' mbsc-err');
        this.state = {
            cssClasses: this.props.className || ''
        };
    }

    static propTypes = {
        valid: PropTypes.bool
    }

    render = () => {
        /* eslint-disable no-unused-vars */
        // justification: variable 'valid' and 'className' is declared due to object decomposition
        var {
            valid,
            className,
            ...other
        } = this.props;

        /* eslint-enable */

        return <label className={this.initialCssClass} {...other}>{this.props.children}</label>;
    }

    componentWillReceiveProps = (nextProps) => {
        var currentClasses = (this.state.cssClasses || '') + (this.props.valid === undefined || this.props.valid ? '' : ' mbsc-err'),
            nextClasses = (nextProps.className || '') + (this.props.valid === undefined || nextProps.valid ? '' : ' mbsc-err');
        if (currentClasses != nextClasses || nextProps.valid != this.props.valid) {
            updateCssClasses.call(this, currentClasses, nextClasses);
        }
        if (this.state.cssClasses !== nextProps.cssClasses) {
            this.setState({
                cssClasses: nextProps.className
            });
        }
    }
}

mobiscroll.Form.Label = MbscLabel;

class MbscFormBase extends MbscOptimized {
    constructor(props, presetName) {
        super(props);
        this.presetName = presetName;
    }

    static propTypes = {
        ...CorePropTypes,
        color: reactString
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.mbscInit, this.state.options);

        // initialize the mobiscroll
        this.instance = new classes[this.mbscInit.component || 'Scroller'](this.inputNode, settings);

        if (this.state.value !== undefined) {
            this.instance.setVal(this.state.value, true);
        }

        // Add change event listener if handler is passed
        $(this.inputNode).on('change', this.props.onChange || (function () { }));
    }

    inputMounted = (input) => {
        this.inputNode = input;
    }

    render = () => {
        /* eslint-disable no-unused-vars */
        // justification: variables 'value', 'onChange' and 'className' are declared due to object decomposition
        var {
            className,
            children,
            value,
            onChange,
            name,
            color,
            ...other
                } = this.props;

        /* eslint-enable no-unused-vars */
        var presetClass = '';
        if (color) {
            presetClass = 'mbsc-' + this.presetName + '-' + color;
        }
        var type = this.inputType || 'text';

        return <div className={presetClass + (this.initialCssClass ? ' ' + this.initialCssClass : '')}>
            {children}
            <input ref={this.inputMounted} type={type} data-role={name} {...other} />
        </div>;
    }
}

class MbscSwitch extends MbscFormBase {
    constructor(props) {
        super(props, 'switch');
        this.mbscInit = {
            component: 'Switch'
        };
        this.inputType = 'checkbox';
    }
}

MbscSwitch.propTypes = {
    ...MbscSwitch.propTypes,
    ...SwitchPropTypes
};

mobiscroll.Switch = MbscSwitch;

class MbscStepper extends MbscFormBase {
    constructor(props) {
        super(props, 'stepper');
        this.mbscInit = {
            component: 'Stepper'
        };
    }
}

MbscStepper.propTypes = {
    ...MbscStepper.propTypes,
    ...StepperPropTypes
};

mobiscroll.Stepper = MbscStepper;

// progress

class MbscProgress extends MbscOptimized {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        ...CorePropTypes,
        "data-icon": reactString,
        "data-icon-align": PropTypes.oneOf(['left', 'right']),
        val: PropTypes.oneOf(['left', 'right']),
        disabled: reactBool,
        max: reactNumber,
        value: reactNumber,
        color: reactString
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new Progress(this.progressNode, settings);
        if (this.state.value !== undefined) {
            this.instance.setVal(this.state.value, true);
        }
    }

    progressMounted = (progress) => {
        this.progressNode = progress;
    }

    render = () => {
        /* eslint-disable no-unused-vars */
        // justification: variable 'value' and 'className' is defined due to object decomposotion
        var {
            className,
            children,
            value,
            color,
            ...other
        } = this.props;

        /* eslint-enable no-unused-vars */
        var presetClass = '';
        if (color) {
            presetClass = 'mbsc-progress-' + color;
        }
        var cssClass = presetClass + (this.initialCssClass ? ' ' + this.initialCssClass : '');
        return <div className={cssClass}>
            {children}
            <progress ref={this.progressMounted} {...other} />
        </div>;
    }
}

mobiscroll.Progress = MbscProgress;

// slider
class MbscSlider extends MbscOptimized {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        ...CorePropTypes,
        highlight: reactBool,
        live: reactBool,
        stepLabels: PropTypes.arrayOf(reactNumber),
        "data-icon": reactString,
        tooltip: reactBool,
        val: PropTypes.oneOf(['left', 'right']),
        disabled: reactBool,
        max: reactNumber,
        min: reactNumber,
        step: reactNumber,
        values: reactNumber,
        color: reactString
    }

    componentDidMount = () => {
        // get settings from state 
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new Slider(this.firstInput, settings);

        if (this.state.value !== undefined) {
            this.instance.setVal(this.state.value, true);
        }
        var that = this;
        // our own change handler - to receive the change event
        $(this.label).on('change', function () {
            if (that.props.onChange) {
                var values = that.instance.getVal();
                that.props.onChange(values);
            }
        });
    }

    firstInputMounted = (input) => {
        this.firstInput = input;
    }

    parentMounted = (label) => {
        this.label = label;
    }

    onValueChanged = () => {
        // this is not triggered - or the event propagation is stopped somewhere on the line
        // to counter this we attach our own change handler in the `componentDidMount` function 
    }

    render = () => {
        /* eslint-disable no-unused-vars */
        // justification: variable 'onChange' and 'className' is defined due to object decomposotion
        var {
            children,
            value,
            onChange,
            className,
            icon,
            live,
            stepLabels,
            tooltip,
            color,
            ...other
        } = this.props,
            values = value || [];
        live = live || this.props['data-live'] || false;
        icon = icon || this.props['data-icon'];
        /* eslint-enable no-unused-vars */

        if (value !== undefined && !Array.isArray(value)) {
            values = [value];
        }

        var presetClass = '';
        if (color) {
            presetClass = 'mbsc-slider-' + color;
        }
        var cssClass = presetClass + (this.initialCssClass ? ' ' + this.initialCssClass : '');

        return <label ref={this.parentMounted} className={cssClass}>
            {children}
            {values.map(function (item, index) {
                if (index === 0) {
                    return <input ref={this.firstInputMounted} data-icon={icon} data-live={live} key={index} type="range" {...other} />;
                }
                return <input key={index} type="range" data-live={live} data-index={index} />;
            }, this)}
        </label>;
    }
}
mobiscroll.Slider = MbscSlider;

class MbscRating extends MbscOptimized {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        ...CorePropTypes,
        val: PropTypes.oneOf(['left', 'right']),
        disabled: reactBool,
        max: reactNumber,
        min: reactNumber,
        step: reactNumber,
        template: reactString,
        empty: reactString,
        filled: reactString,
        value: reactNumber,
        color: reactString
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new Rating(this.inputNode, settings);
        if (this.state.value !== undefined) {
            this.instance.setVal(this.state.value, true);
        }

        $(this.label).on('change', () => {
            if (this.props.onChange) {
                var value = this.instance.getVal();
                this.props.onChange(value);
            }
        });
    }

    inputMounted = (input) => {
        this.inputNode = input;
    }

    parentMounted = (label) => {
        this.label = label;
    }

    render = () => {
        /* eslint-disable no-unused-vars */
        // justification: variable 'value' and 'className' is defined due to object decomposotion
        var {
            className,
            children,
            onChange,
            value,
            empty,
            filled,
            template,
            val,
            color,
            ...other
        } = this.props;
        /* eslint-enable no-unused-vars */

        var presetClass = '';
        if (color) {
            presetClass = 'mbsc-rating-' + color;
        }
        var cssClass = presetClass + (this.initialCssClass ? ' ' + this.initialCssClass : '');

        return <label className={cssClass} ref={this.parentMounted}>
            {children}
            <input type="rating" data-role="rating" data-val={val} data-template={template} data-empty={empty} data-filled={filled} ref={this.inputMounted} {...other} />
        </label>;
    }
}
mobiscroll.Rating = MbscRating;

export default mobiscroll;
