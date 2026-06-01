# Hello World其二

这一小节我们将通过一个“简单”但上手略有难度的实战来学习如何进行游戏逻辑审计并找到我们需要的函数入口。这一节的具体例子并不是所有游戏通用的，但它的思路和方法是非常具有代表性的，适合初学者学习。本节的具体目标是找到《东方夜雀食堂》中左下角通知消息的函数，并让其显示"Hello World!"。

## 前提

在开始之前，请确保您已经完成了[开发入门](./getting_started.md)中的全部内容，并清楚：游戏逻辑审计并不是单单是对一位模组开发者的考验，更与游戏原开发者的编程习惯、游戏的架构设计、以及il2cpp编译器的优化策略，甚至是代码是否涉及混淆等多方面因素相关，一个优秀的游戏架构设计和清晰的代码结构会大大降低模组开发者的审计难度，而混淆和过度优化则会增加审计难度。很幸运，《东方夜雀食堂》的代码结构非常清晰严谨，且没有使用任何的混淆，因此我们可以通过一些轻松的分析方法来找到目标函数。排除这些客观因素外，剩下的就是考验模组开发者自身的逆向能力了，您可以在实践中不断提升自己的逆向能力，积累经验，逐渐能够应对更复杂的逻辑或游戏。


## 整体审计

在逆向一个游戏前，需要先了解游戏的整体架构和代码风格，主要是命名习惯、模块划分、以及常用的设计模式等。对于《东方夜雀食堂》来说，整体以`Common/DayScene/GameData/MainScene/NightScene/其他`进行划分，完全使用英语进行命名，且类名、方法名、字段名都非常清晰地表达了它们的功能和用途。与UI相关的类常以`UI`表现，与DLC相关的类常以`DLCx`表现，`GameData`是整个游戏的数据中心。

![image-20260601123546708](./hello_world_2.assets/image-20260601123546708.png)


## 游戏逻辑分析

想知道一个功能对应的函数，首先需要分析这个功能的调用流程。这个功能如何被触发？它的调用关系是什么？它的输入输出是什么？这些都是我们需要分析的问题。对于左下角的通知消息，我们很容易发现：

1. 需要一个字符串作为输入。
2. 多条通知会同时展示，并有先后次序和各自的生命周期。
3. 通知常常在任务开始、任务结束等节点出现，这说明他们之间可能存在调用关系。
4. 除了纯文本通知外，常常会出现带有图标的通知，这说明他们可能会调用同一个底层函数来展示不同的内容，并且可能是由同一个游戏对象来管理的(他们在代码上是相近的)。
5. 该通知不仅存在DayScene，也会在NightScene中出现。

![image-20260601123641378](./hello_world_2.assets/image-20260601123641378.png)

![image-20260601123705298](./hello_world_2.assets/image-20260601123705298.png)

![image-20260601123803783](./hello_world_2.assets/image-20260601123803783.png)

## 代码审计

通过上面的分析，我们可以大概有个搜索方向：

1. 与UI有关，可能是命名空间含有`UI`的类。
2. 与通知有关，可能是命名空间含有`Notify`、`Message`、`Toast`等的类。
3. 与场景无关，可能是既在DayScene又在NightScene中，或直接在Common中。
4. 会有很多变种，可以单独输入字符串，也可能输入多种参数来展示不同的通知。
5. 有多种调用情况，如果熟悉其他通知的触发条件和调用关系，可以根据查找调用关系来确认。

最终可以确认`Common.UI.ReceivedObjectDisplayerController`是我们需要找到的类，其有成员函数`NotifyTextMessage`的签名是`public void NotifyTextMessage(string content)`，完全符合我们的预期。

![image-20260601124449894](./hello_world_2.assets/image-20260601124449894.png)

如图，我们还发现其继承自`DEYU.Singletons.MonoSingleton<Common.UI.ReceivedObjectDisplayerController>`，这是游戏自行实现的单例模式，这意味着我们可以直接通过形如`.Instance`的方式来直接访问这个类的实例，并调用它的成员函数来展示通知。

为进行测试，我们在`PluginManager.Update`中添加如下代码：

```csharp
if (Input.GetKeyDown(KeyCode.F2)) // 按下 F2 键
{
	Common.UI.ReceivedObjectDisplayerController.Instance.NotifyTextMessage("Hello World!");
}
```

![image-20260601124804831](./hello_world_2.assets/image-20260601124804831.png)

然而我们发现，编译器报错，

> error CS0012: 类型“MonoSingleton<>”在未引用的程序集中定义。必须添加对程序集“DEYU.Singletons, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null”的引用。

因此我们继续添加引用`BepInEx/interop/DEYU.Singletons.dll`，并重新编译。编译成功后，启动游戏，按<kbd>F2</kbd>键，即可看到左下角成功弹出了我们的Hello World通知。

![image-20260601125221011](./hello_world_2.assets/image-20260601125221011.png)

## Hook 辅助

如果难以直接调用函数，也可以使用下一节将学习的`HarmonyPatch`来Hook这个函数，在函数被调用时让它执行我们自己的代码，也能够帮助我们确定某个函数是否被执行。

## AI 辅助

使用AI进行辅助定位审计是极其高效的。初学者并不用担心大量使用AI会无法提高自己的能力，但也不应过度依赖AI。请务必辩证合理地利用AI和其提供的信息。
