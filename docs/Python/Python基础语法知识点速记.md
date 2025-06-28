---
title: Python基础语法知识点速览
sidebar_position: 1

---

# Python基础语法知识点速览

## 一、基础语法
### 1. 变量赋值

**说明**：动态类型语言，无需声明类型。  
**案例**：

```python
x = 5          # 整数
name = "Alice" # 字符串
is_ok = True   # 布尔值

```



### 2. 条件语句（`if-elif-else`）

**说明**：根据条件执行不同代码块。
**案例**：判断数字正负：

```python
num = -3
if num > 0:
    print("正数")
elif num == 0:
    print("零")
else:
    print("负数")  # 输出：负数
```

### 3. 循环语句

#### `for`循环

**说明**：遍历可迭代对象（如列表、字符串）。
**案例**：遍历列表并打印元素：

```python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)  # 输出：apple、banana、cherry
```

#### `while`循环

**说明**：条件为真时重复执行。
**案例**：计算 1 到 5 的和：

```python
sum_num = 0
i = 1
while i <= 5:
    sum_num += i
    i += 1
print(sum_num)  # 输出：15
```

### 4. 函数定义（`def`）

**说明**：用`def`关键字定义函数，可带参数和返回值。
**案例**：计算平方的函数：

```python
def square(x):
    return x ** 2

result = square(3)
print(result)  # 输出：9
```

## 二、常用数据结构

### 1. 列表（List）

**特点**：有序、可变、可重复。
**案例**：列表操作：

```python
lst = [1, 2, 3]
lst.append(4)       # 添加元素
lst[0] = 10         # 修改元素
print(lst)          # 输出：[10, 2, 3, 4]
```

### 2. 元组（Tuple）

**特点**：有序、不可变、可重复。
**案例**：元组操作：

```python
tpl = (1, 2, 3)
# tpl[0] = 10  # 报错！元组不可修改
print(tpl[1])     # 输出：2
```

### 3. 字典（Dictionary）

**特点**：键值对存储，无序，键唯一。
**案例**：字典操作：

```python
info = {"name": "Bob", "age": 25}
info["email"] = "bob@example.com"  # 添加键值对
print(info["name"])                 # 输出：Bob
```

### 4. 集合（Set）

**特点**：无序、唯一、可修改。
**案例**：集合去重与交集：

```python
nums = {1, 2, 2, 3}
print(nums)          # 输出：{1, 2, 3}（自动去重）
a = {1, 2, 3}
b = {3, 4, 5}
print(a & b)         # 输出：{3}（交集）
```

### 5. 字符串（String）

**特点**：有序、不可变，用单 / 双引号定义。
**案例**：字符串切片与拼接：

```python
s = "Hello, World!"
print(s[0:5])       # 输出："Hello"（切片）
new_s = s + " Nice to meet you!"
print(new_s)        # 输出：拼接后的长字符串
```

## 三、面向对象编程（OOP）

### 1. 类与对象

**说明**：

- **类（Class）**：抽象的模板，定义属性和方法。
- **对象（Object）**：类的实例，通过 `类名()` 创建。
  **案例**：定义一个简单的 `Person` 类：

```python
class Person:
    def __init__(self, name, age):  # 构造方法（初始化属性）
        self.name = name    # 实例属性
        self.age = age
    
    def say_hello(self):    # 实例方法
        return f"Hello, my name is {self.name}, age {self.age}."

# 创建对象
alice = Person("Alice", 30)
print(alice.name)         # 输出：Alice（访问属性）
print(alice.say_hello())  # 输出：Hello, my name is Alice, age 30.
```

### 2. 方法类型

**说明**：

- **实例方法**：绑定实例（`self` 参数），操作实例属性。
- **类方法**：绑定类（`@classmethod` 装饰器，`cls` 参数），操作类属性。
- **静态方法**：不绑定实例或类（`@staticmethod` 装饰器），独立功能。
  **案例**：三种方法对比：

```python
class Math:
    pi = 3.14  # 类属性

    def __init__(self, radius):
        self.radius = radius  # 实例属性

    # 实例方法：计算圆面积（依赖实例属性 radius）
    def calculate_area(self):
        return self.pi * self.radius ** 2

    # 类方法：修改类属性 pi（通过 cls 访问类）
    @classmethod
    def set_pi(cls, value):
        cls.pi = value

    # 静态方法：独立功能（不依赖实例/类）
    @staticmethod
    def add(a, b):
        return a + b

# 使用实例方法
circle = Math(5)
print(circle.calculate_area())  # 输出：78.5（默认 pi=3.14）

# 使用类方法修改类属性
Math.set_pi(3.1416)
print(Math.pi)  # 输出：3.1416

# 使用静态方法
print(Math.add(2, 3))  # 输出：5
```

### 3. 继承（Inheritance）

**说明**：
子类继承父类的属性和方法，可重写或扩展功能。
**案例**：单继承示例（动物类 → 狗类）：

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        return "Animal sound"  # 父类方法

# 子类 Dog 继承 Animal
class Dog(Animal):
    def __init__(self, species, name):
        super().__init__(species)  # 调用父类构造方法
        self.name = name          # 子类新增属性

    def speak(self):  # 重写父类方法
        return "Woof!"

# 创建子类对象
dog = Dog("Canine", "Buddy")
print(dog.speak())   # 输出：Woof!（调用子类重写的方法）
print(dog.species)   # 输出：Canine（继承父类属性）
```

### 4. 多态（Polymorphism）

**说明**：
不同类的对象对同一方法有不同的实现，调用时自动匹配具体类的方法。
**案例**：不同动物的 `speak` 方法表现不同：

```python
class Cat(Animal):
    def speak(self):
        return "Meow!"

# 多态：统一接口处理不同对象
def get_animal_sound(animal):
    return animal.speak()

animal1 = Dog("Canine", "Buddy")
animal2 = Cat("Feline", "Mimi")
print(get_animal_sound(animal1))  # 输出：Woof!（Dog 的实现）
print(get_animal_sound(animal2))  # 输出：Meow!（Cat 的实现）
```

### 5. 封装（Encapsulation）

**说明**：
将属性和方法包装在类中，通过访问控制（公有 / 私有）限制外部访问。
**案例**：私有属性示例：

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # 私有属性（双下划线开头）

    def get_balance(self):  # 公有方法访问私有属性
        return self.__balance

    def deposit(self, amount):  # 公有方法修改私有属性
        self.__balance += amount

account = BankAccount(1000)
# print(account.__balance)  # 报错！无法直接访问私有属性
print(account.get_balance())  # 输出：1000（通过公有方法访问）
account.deposit(500)
print(account.get_balance())  # 输出：1500
```